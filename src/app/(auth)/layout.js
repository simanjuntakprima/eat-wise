
import '../globals.css';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <div className="max-h-screen">
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
