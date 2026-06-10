export default function AuthGuard({ user, children }) {
  return user ? children : null;
}
