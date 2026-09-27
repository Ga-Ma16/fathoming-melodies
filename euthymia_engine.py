import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.optimize import minimize
from sklearn.linear_model import HuberRegressor
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from sklearn.svm import SVC
from sklearn.kernel_ridge import KernelRidge

def run_euthymia_pipeline():
    # Create directory for outputting plots so the IDE script doesn't freeze
    os.makedirs('visualizations', exist_ok=True)
    
    # ==========================================
    # 0. DATASET PREPARATION & MATRICES
    # ==========================================
    # Set visualization aesthetic
    sns.set_theme(style="darkgrid", palette="mako")

    print("Loading dataset...")
    df = pd.read_csv('spotify.csv')
    features = ['valence', 'energy', 'danceability']
    df_clean = df.dropna(subset=features + ['track_popularity', 'playlist_genre'])

    # Sample 2,000 rows to ensure matrix inversions run instantly locally
    df_sample = df_clean.sample(2000, random_state=42)

    X_raw = df_sample[features].values
    y_reg = df_sample['track_popularity'].values 

    # Standardize Features (Z-score normalization)
    X_mean, X_std = np.mean(X_raw, axis=0), np.std(X_raw, axis=0)
    X = (X_raw - X_mean) / X_std
    X_design = np.c_[np.ones(X.shape[0]), X] # Append column of 1s for the Intercept

    # Classification Targets
    y_bin = (y_reg >= 60).astype(int) # Binary Target: Hit (1) vs Flop (0)
    genre_mask = df_sample['playlist_genre'].isin(['pop', 'edm'])
    X_genre = X[genre_mask]
    y_genre = (df_sample['playlist_genre'][genre_mask] == 'pop').astype(int)

    print(f"Data Pipeline Initialized. Matrix X Shape: {X.shape}")

    # ==========================================
    # PHASE 1: LINEAR MODELS FOR REGRESSION
    # Target: track_popularity (Continuous)
    # ==========================================
    print("Executing Phase 1: Linear Regression Models...")

    # 1. OLS & Maximum Likelihood Estimation
    X_T = X_design.T
    beta_ols = np.linalg.inv(X_T.dot(X_design)).dot(X_T).dot(y_reg)

    # 2. Robust Linear Regression (Huber Loss)
    huber = HuberRegressor().fit(X, y_reg)
    beta_huber = np.insert(huber.coef_, 0, huber.intercept_)

    plt.figure(figsize=(10, 5))
    plt.scatter(X[:, 0], y_reg, alpha=0.3, color='gray', label='Spotify Tracks (Valence)')
    x_line = np.linspace(-3, 3, 100)
    plt.plot(x_line, beta_ols[0] + beta_ols[1]*x_line, color='cyan', lw=3, label='1. OLS (MLE) Fit')
    plt.plot(x_line, beta_huber[0] + beta_huber[1]*x_line, color='magenta', lw=3, ls='--', label='2. Robust Huber Fit')
    plt.title('Algorithm 1 & 2: OLS vs. Robust Regression on Popularity')
    plt.xlabel('Valence (Standardized)')
    plt.ylabel('Popularity')
    plt.legend()
    plt.savefig('visualizations/01_ols_vs_robust.png', bbox_inches='tight')
    plt.close()

    # 3. Ridge Regression (Coefficient Path)
    lambdas = np.logspace(-1, 4, 100)
    coefs = []
    I = np.eye(X_design.shape[1])
    I[0, 0] = 0 # Don't penalize intercept
    for l in lambdas:
        b_ridge = np.linalg.inv(X_T.dot(X_design) + l * I).dot(X_T).dot(y_reg)
        coefs.append(b_ridge[1:]) # Store weights, ignore intercept

    plt.figure(figsize=(10, 5))
    plt.plot(lambdas, coefs, lw=2)
    plt.xscale('log')
    plt.title('Algorithm 3: Ridge Regression L2 Penalty Shrinkage')
    plt.xlabel('Lambda (L2 Penalty)')
    plt.ylabel('Feature Weights (Valence, Energy, Danceability)')
    plt.legend(features)
    plt.savefig('visualizations/02_ridge_shrinkage.png', bbox_inches='tight')
    plt.close()

    # 4. Bayesian Linear Regression (Uncertainty)
    sigma_sq = np.var(y_reg - X_design.dot(beta_ols))
    alpha, beta_noise = 1.0, 1.0 / sigma_sq
    posterior_cov = np.linalg.inv(alpha * I + beta_noise * X_T.dot(X_design))
    posterior_mean = beta_noise * posterior_cov.dot(X_T).dot(y_reg)

    # Calculate variance for shading (Confidence Interval)
    X_line_design = np.c_[np.ones(100), x_line, np.zeros(100), np.zeros(100)] # Isolating valence
    pred_variance = [1/beta_noise + x_i.T.dot(posterior_cov).dot(x_i) for x_i in X_line_design]
    pred_std = np.sqrt(pred_variance)

    plt.figure(figsize=(10, 5))
    y_pred_bayes = X_line_design.dot(posterior_mean)
    plt.plot(x_line, y_pred_bayes, color='yellow', lw=2, label='Bayesian Mean')
    plt.fill_between(x_line, y_pred_bayes - 2*pred_std, y_pred_bayes + 2*pred_std, color='yellow', alpha=0.2, label='±2 Std Dev (Uncertainty)')
    plt.title('Algorithm 4: Bayesian Linear Regression Posterior')
    plt.xlabel('Valence')
    plt.legend()
    plt.savefig('visualizations/03_bayesian_linear.png', bbox_inches='tight')
    plt.close()

    # ==========================================
    # PHASE 2: LINEAR CLASSIFICATION (POP VS EDM)
    # ==========================================
    print("Executing Phase 2: Classification Projections...")

    # 5. Fisher's Discriminant Function (1D Projection)
    class_0, class_1 = X_genre[y_genre == 0], X_genre[y_genre == 1]
    mean_0, mean_1 = np.mean(class_0, axis=0), np.mean(class_1, axis=0)
    S_W = np.cov(class_0, rowvar=False) + np.cov(class_1, rowvar=False)
    fisher_w = np.linalg.inv(S_W).dot(mean_1 - mean_0)

    # Project onto 1D axis
    proj_0 = class_0.dot(fisher_w)
    proj_1 = class_1.dot(fisher_w)

    plt.figure(figsize=(10, 5))
    sns.kdeplot(proj_0, fill=True, color='purple', label='EDM (Class 0)')
    sns.kdeplot(proj_1, fill=True, color='green', label='Pop (Class 1)')
    plt.title('Algorithm 5: Fisher\'s Linear Discriminant Projection')
    plt.xlabel('1D Projection Axis (Maximized Separation)')
    plt.legend()
    plt.savefig('visualizations/04_fishers_projection.png', bbox_inches='tight')
    plt.close()

    # 6. Probabilistic Generative Models (GDA)
    gda = QuadraticDiscriminantAnalysis().fit(X_genre[:, :2], y_genre) # Using Valence & Energy
    plt.figure(figsize=(10, 5))
    sns.scatterplot(x=X_genre[:, 0], y=X_genre[:, 1], hue=y_genre, palette=['purple', 'green'], alpha=0.6)
    plt.title('Algorithm 6: Generative GDA Feature Space')
    plt.xlabel('Valence')
    plt.ylabel('Energy')
    plt.savefig('visualizations/05_gda_generative.png', bbox_inches='tight')
    plt.close()

    # 7. Probabilistic Discriminative (Logistic Regression)
    def sigmoid(z): return 1 / (1 + np.exp(-np.clip(z, -250, 250)))
    beta_log = np.zeros(X_design.shape[1])
    for _ in range(1000): # Gradient Ascent
        beta_log += 0.01 * (X_design.T.dot(y_bin - sigmoid(X_design.dot(beta_log))) / len(y_bin))

    plt.figure(figsize=(10, 5))
    plt.scatter(X[:, 0], y_bin, alpha=0.1, color='gray')
    plt.plot(x_line, sigmoid(beta_log[0] + beta_log[1]*x_line), color='red', lw=3, label='Discriminative Sigmoid')
    plt.title('Algorithm 7: Logistic Regression (Hit Probability)')
    plt.xlabel('Valence')
    plt.ylabel('P(Hit = 1)')
    plt.legend()
    plt.savefig('visualizations/06_logistic_sigmoid.png', bbox_inches='tight')
    plt.close()

    # ==========================================
    # PHASE 3: BAYESIAN LOGISTIC CLASSIFICATION
    # ==========================================
    print("Executing Phase 3: Bayesian Approximations...")

    # 8 & 9. Bayesian Logistic & Laplacian Approximation
    def neg_log_posterior(w):
        prior = 0.5 * np.sum(w**2)
        preds = np.clip(sigmoid(X_design.dot(w)), 1e-10, 1 - 1e-10)
        likelihood = np.sum(y_bin * np.log(preds) + (1 - y_bin) * np.log(1 - preds))
        return prior - likelihood

    # Find MAP Mode
    w_map = minimize(neg_log_posterior, np.zeros(X_design.shape[1]), method='BFGS').x

    # Laplace Hessian
    preds_map = sigmoid(X_design.dot(w_map))
    S = np.diag(preds_map * (1 - preds_map))
    laplace_cov = np.linalg.inv(X_design.T.dot(S).dot(X_design) + np.eye(X_design.shape[1]))

    print("--- Bayesian Posterior Approximations ---")
    print("Laplace Approximation MAP Weights:", np.round(w_map, 4))
    print("Laplace Posterior Covariance Trace:", round(np.trace(laplace_cov), 4))

    # ==========================================
    # PHASE 4: SVMs & THE KERNEL SPACE
    # ==========================================
    print("Executing Phase 4: SVM and Kernel Boundaries...")

    # 10. Linear SVM
    svm_linear = SVC(kernel='linear').fit(X_genre[:, :2], y_genre)

    # 11. Kernel Functions & The Kernel Trick (RBF)
    svm_rbf = SVC(kernel='rbf', gamma=1.0).fit(X_genre[:, :2], y_genre)

    # Plotting SVM Boundaries
    xx, yy = np.meshgrid(np.linspace(-3, 3, 50), np.linspace(-3, 3, 50))
    Z_lin = svm_linear.decision_function(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    Z_rbf = svm_rbf.decision_function(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    fig, axes = plt.subplots(1, 2, figsize=(16, 6))
    axes[0].contourf(xx, yy, Z_lin > 0, alpha=0.3, cmap='coolwarm')
    axes[0].scatter(X_genre[:, 0], X_genre[:, 1], c=y_genre, cmap='coolwarm', edgecolors='k', alpha=0.6)
    axes[0].set_title('Algorithm 10: Linear SVM Boundary')

    axes[1].contourf(xx, yy, Z_rbf > 0, alpha=0.3, cmap='coolwarm')
    axes[1].scatter(X_genre[:, 0], X_genre[:, 1], c=y_genre, cmap='coolwarm', edgecolors='k', alpha=0.6)
    axes[1].set_title('Algorithm 11: RBF Kernel SVM Boundary')
    plt.savefig('visualizations/07_svm_boundaries.png', bbox_inches='tight')
    plt.close()

    # 12. Using Kernels in GLMs (Kernel Ridge Regression)
    krr = KernelRidge(kernel='rbf', gamma=0.1).fit(X[:, :1], y_reg)
    y_krr = krr.predict(x_line.reshape(-1, 1))

    plt.figure(figsize=(10, 5))
    plt.scatter(X[:, 0], y_reg, alpha=0.1, color='gray')
    plt.plot(x_line, y_krr, color='orange', lw=3, label='Kernelized Regression (RBF)')
    plt.title('Algorithm 12: Kernel Ridge Regression')
    plt.xlabel('Valence')
    plt.ylabel('Popularity')
    plt.legend()
    plt.savefig('visualizations/08_kernel_glm.png', bbox_inches='tight')
    plt.close()

    print("\n✅ Euthymia Mathematical Engine complete.")
    print("All visualizations successfully saved to the 'visualizations/' directory.")

if __name__ == "__main__":
    run_euthymia_pipeline()