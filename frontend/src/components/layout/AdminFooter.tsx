export function AdminFooter() {
  return (
    <footer className="py-6 px-8 border-t border-neutral-100 bg-white/50 text-center shrink-0">
      <p className="text-sm text-neutral-500 font-medium">
        &copy; {new Date().getFullYear()} Thriftly Admin Portal. All rights reserved. Version 1.0.0
      </p>
    </footer>
  );
}
