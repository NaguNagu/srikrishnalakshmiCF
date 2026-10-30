'use client';
import { useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function Brand() {
  const filterId = `sklcf-navy-${useId().replace(/:/g, '')}`;
  return <Link href="/" className="brand">
    {/* Recolour the original registered artwork without tracing or redrawing it.
        The green channel separates the red mark from its pale scanned background. */}
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs><filter id={filterId} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 .0902 0 0 0 0 .2314 0 0 0 0 .3608 0 -1.4 0 0 1.2" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter></defs>
    </svg>
    <Image src="/sklcf-logo.png" width={68} height={45} unoptimized alt="SKLCF logo" style={{ filter: `url(#${filterId})`, mixBlendMode: 'normal' }} />
    <span>Sri Krishna Lakshmi<small>CHIT FUNDS</small></span>
  </Link>;
}
