export type AuthContext = 'login' | 'signup' | 'reset' | 'update';

export function getFriendlyAuthError(rawMessage: string, context: AuthContext = 'login', locale: 'es' | 'en' = 'es'): { title: string; description: string } {
  const msg = rawMessage?.toLowerCase() || '';
  const isEs = locale === 'es';

  // Common buckets
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('invalid email or password')) {
    return {
      title: isEs ? 'Credenciales inválidas' : 'Invalid credentials',
      description: isEs ? 'Verifique su email y contraseña e intente nuevamente.' : 'Please check your email and password and try again.'
    };
  }

  if (msg.includes('user already registered')) {
    return {
      title: isEs ? 'Usuario ya registrado' : 'User already registered',
      description: isEs ? 'Este email ya está registrado. Use la opción de iniciar sesión.' : 'This email is already registered. Please sign in instead.'
    };
  }

  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return {
      title: isEs ? 'Demasiados intentos' : 'Too many attempts',
      description: isEs ? 'Se han realizado demasiados intentos. Espere unos minutos e intente de nuevo.' : 'Too many attempts. Please wait a few minutes and try again.'
    };
  }

  if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
    return {
      title: isEs ? 'Problema de conexión' : 'Connection problem',
      description: isEs ? 'No se pudo establecer conexión. Verifique su red e intente de nuevo.' : 'Could not connect. Please check your network and try again.'
    };
  }

  // Fallbacks by context
  switch (context) {
    case 'signup':
      return {
        title: isEs ? 'No se pudo crear la cuenta' : 'Could not create account',
        description: isEs ? 'Revise los datos e intente nuevamente.' : 'Please review your details and try again.'
      };
    case 'reset':
      return {
        title: isEs ? 'No se pudo enviar el email' : 'Could not send email',
        description: isEs ? 'Intente nuevamente en unos minutos.' : 'Please try again in a few minutes.'
      };
    case 'update':
      return {
        title: isEs ? 'No se pudo actualizar la contraseña' : 'Could not update password',
        description: isEs ? 'Intente nuevamente.' : 'Please try again.'
      };
    default:
      return {
        title: isEs ? 'Ocurrió un error' : 'Something went wrong',
        description: isEs ? 'Intente nuevamente en unos instantes.' : 'Please try again in a moment.'
      };
  }
}


