export function renderAuth(container, onAuthenticated) {
  let isLogin = true;
  
  const render = () => {
    container.innerHTML = `
      <div class="auth-container">
        <h2>${isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form class="auth-form" id="authForm">
          <div class="form-group">
            <input type="email" id="email" placeholder="Email address" required />
          </div>
          <div class="form-group">
            <input type="password" id="password" placeholder="Password" required />
          </div>
          <button type="submit" class="btn-primary btn-lg">${isLogin ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <div class="auth-toggle">
          <button id="toggleAuth">
            ${isLogin ? 'Need an account? Create one' : 'Already have an account? Sign in'}
          </button>
        </div>
        <div class="auth-options">
          <div class="demo-account">
            <button id="demoAccountBtn" class="btn-secondary btn-lg">Try Demo Account</button>
          </div>
          <div class="direct-access">
            <button id="directAccessBtn" class="btn-lg">Direct Access (No Login)</button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('toggleAuth').addEventListener('click', () => {
      isLogin = !isLogin;
      render();
    });
    
    document.getElementById('authForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const { loginUser, registerUser } = await import('../storage.js');
        
        if (isLogin) {
          await loginUser(email, password);
        } else {
          await registerUser(email, password);
        }
        
        if (onAuthenticated) onAuthenticated();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
    
    // Add demo account button listener
    document.getElementById('demoAccountBtn').addEventListener('click', async () => {
      try {
        const { loginUser } = await import('../storage.js');
        
        // Use demo account credentials
        const demoEmail = "demo@example.com";
        const demoPassword = "demo123";
        
        // Auto-fill the form fields
        document.getElementById('email').value = demoEmail;
        document.getElementById('password').value = demoPassword;
        
        // Login with demo account
        await loginUser(demoEmail, demoPassword);
        
        if (onAuthenticated) onAuthenticated();
      } catch (error) {
        alert(`Error logging in with demo account: ${error.message}`);
      }
    });
    
    // Add direct access button listener
    document.getElementById('directAccessBtn').addEventListener('click', async () => {
      try {
        const { loginUser } = await import('../storage.js');
        
        // Login with demo account without showing credentials
        await loginUser();
        
        if (onAuthenticated) onAuthenticated();
      } catch (error) {
        alert(`Error with direct access: ${error.message}`);
      }
    });
  };
  
  render();
}
