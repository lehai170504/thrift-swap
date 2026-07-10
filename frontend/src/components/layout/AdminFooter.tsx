export function AdminFooter() {
  return (
    <footer className="py-6 px-8 border-t border-white/10 glass text-center shrink-0">
      <p className="text-sm text-muted-foreground font-medium">
        &copy; {new Date().getFullYear()} Thriftly Admin Portal. All rights reserved. Version 1.0.0
      </p>
    </footer>
  );
}
