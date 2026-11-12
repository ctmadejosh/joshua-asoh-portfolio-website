const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center bg-primary text-white">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">Page not found</h1>
        <p className="mt-6 max-w-md text-xl text-sky">
          There's nothing at this address. The rest of the site is one page, so the home
          page has everything.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-primary transition-colors hover:bg-signal hover:text-ink"
        >
          Go to the home page
        </a>
      </div>
    </main>
  );
};

export default NotFound;
