import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader2,
  User,
  Building
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'login' | 'register' | 'forgot' | 'reset';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register, requestPasswordReset, resetPassword } = useAuth();
  
  const [view, setView] = useState<ModalView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [demoResetToken, setDemoResetToken] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    departement: '',
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset password state
  const [resetData, setResetData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: '',
  });

  const departements = [
    'Direction',
    'Qualité',
    'Production',
    'Maintenance',
    'Logistique',
    'Achats',
    'Service Client',
    'R&D',
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(loginData.email, loginData.password, loginData.rememberMe);
    
    setIsLoading(false);
    
    if (result.success) {
      onClose();
      setLoginData({ email: '', password: '', rememberMe: false });
    } else {
      setError(result.error || 'Erreur de connexion');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    const result = await register({
      email: registerData.email,
      password: registerData.password,
      nom: registerData.nom,
      prenom: registerData.prenom,
      departement: registerData.departement,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        setView('login');
        setSuccess('');
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          nom: '',
          prenom: '',
          departement: '',
        });
      }, 2000);
    } else {
      setError(result.error || 'Erreur lors de l\'inscription');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await requestPasswordReset(forgotEmail);

    setIsLoading(false);

    if (result.success) {
      setSuccess('Si cet email existe, un lien de réinitialisation a été envoyé.');
      if (result.demoToken) {
        setDemoResetToken(result.demoToken);
        setResetData(prev => ({ ...prev, token: result.demoToken || '' }));
      }
    } else {
      setError(result.error || 'Erreur lors de la demande');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (resetData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    const result = await resetPassword(resetData.token, resetData.newPassword);

    setIsLoading(false);

    if (result.success) {
      setSuccess('Mot de passe réinitialisé avec succès !');
      setTimeout(() => {
        setView('login');
        setSuccess('');
        setResetData({ token: '', newPassword: '', confirmPassword: '' });
        setDemoResetToken('');
      }, 2000);
    } else {
      setError(result.error || 'Erreur lors de la réinitialisation');
    }
  };

  const resetState = () => {
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2c3e50] to-[#3498db] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view !== 'login' && (
                <button
                  onClick={() => {
                    setView('login');
                    resetState();
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {view === 'login' && 'Connexion'}
                  {view === 'register' && 'Inscription'}
                  {view === 'forgot' && 'Mot de passe oublié'}
                  {view === 'reset' && 'Réinitialiser'}
                </h2>
                <p className="text-sm text-blue-100">Q-TRACK by RIAHI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={18} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Login Form */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    className="w-4 h-4 text-[#3498db] border-gray-300 rounded focus:ring-[#3498db]"
                  />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    resetState();
                  }}
                  className="text-sm text-[#3498db] hover:text-[#2980b9] font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setView('register');
                      resetState();
                    }}
                    className="text-[#3498db] hover:text-[#2980b9] font-medium"
                  >
                    S'inscrire
                  </button>
                </p>
              </div>

              {/* Demo credentials */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-700 font-medium mb-1">Compte démo :</p>
                <p className="text-xs text-blue-600">Email: admin@riahisolutions.com</p>
                <p className="text-xs text-blue-600">Mot de passe: Admin123!</p>
              </div>
            </form>
          )}

          {/* Register Form */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={registerData.prenom}
                      onChange={(e) => setRegisterData({ ...registerData, prenom: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                      placeholder="Prénom"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={registerData.nom}
                    onChange={(e) => setRegisterData({ ...registerData, nom: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={registerData.departement}
                    onChange={(e) => setRegisterData({ ...registerData, departement: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] appearance-none bg-white"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {departements.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Min. 8 caractères"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Inscription...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Envoyer le lien'
                )}
              </button>

              {demoResetToken && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700 font-medium mb-2">Mode démo - Token de réinitialisation :</p>
                  <code className="text-xs text-yellow-800 break-all block bg-yellow-100 p-2 rounded">
                    {demoResetToken}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      setView('reset');
                      setResetData(prev => ({ ...prev, token: demoResetToken }));
                    }}
                    className="mt-2 text-xs text-yellow-700 hover:text-yellow-800 font-medium underline"
                  >
                    Utiliser ce token pour réinitialiser
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Reset Password Form */}
          {view === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token de réinitialisation</label>
                <input
                  type="text"
                  value={resetData.token}
                  onChange={(e) => setResetData({ ...resetData, token: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm font-mono"
                  placeholder="Collez votre token ici"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Min. 8 caractères"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
