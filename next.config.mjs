/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/:path*',
      has: [{ type: 'header', key: 'host', value: 'markfasel.dev' }],
      destination: 'https://www.markfasel.dev/:path*',
      permanent: true
    }
  ]
};

export default nextConfig;
