import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'ik.imagekit.io'
      },
     
      {
        protocol:'https',
        hostname:'html.tailus.io'
        
      },
      
      {
        protocol:'https',
        hostname:'pngdownload.io'
      },
      {
        protocol:'https',
        hostname:'images.oppomobile.com'
      },
      {
        protocol:'https',
        hostname:'example.com'
      }
    ]
  }

};

export default nextConfig;
