import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFound() {
  usePageTitle('Sahifa topilmadi');
  return (
    <div className="empty">
      <h1 className="page-title" tabIndex={-1}>Sahifa topilmadi</h1>
      <p className="lede">Bu manzil mavjud emas.</p>
      <div className="actions" style={{ justifyContent: 'center' }}>
        <Link className="btn" to="/">Bosh sahifa</Link>
      </div>
    </div>
  );
}
