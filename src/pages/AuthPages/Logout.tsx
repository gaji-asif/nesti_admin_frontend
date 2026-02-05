import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { api, bootstrapCsrf } from '../../api/config';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await bootstrapCsrf(); // only if CSRF cookie is needed
        await api.post('/logout'); // sends to {{base_url}}/api/logout
      } catch (e) {
        console.warn('Logout API failed, continuing client logout', e);
      } finally {
        try { logout(); } catch { /* ignore */ }
        navigate('/login');
      }
    })();
  }, [logout, navigate]);

  return <>Logging out…</>;
}
