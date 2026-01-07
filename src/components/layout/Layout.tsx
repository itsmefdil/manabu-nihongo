import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '260px', /* Width of sidebar */
                padding: 'var(--spacing-xl)',
                minHeight: '100vh'
            }}>
                <Outlet />
            </main>
        </div>
    );
}
