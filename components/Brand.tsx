import Link from 'next/link';
import Image from 'next/image';
export default function Brand() {
  return <Link href="/" className="brand"><Image src="/sklcf-logo.png" width={68} height={45} alt="SKLCF logo" /><span>Sri Krishna Lakshmi<small>CHIT FUNDS</small></span></Link>;
}
