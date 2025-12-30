import Image from 'next/image';
export function Logotype() {
  return (
    <>
      <div className='w-12 h-12 bg-primary rounded-sm flex items-center justify-center'>
        <Image
          src='/ppr-logotype-dark.png'
          alt=''
          width={100}
          height={100}
          priority
        />
      </div>
      <div className='flex flex-col leading-tight'>
        <span className='font-bold text-md text-nowrap text-foreground'>
          PALE <span className='text-primary'>PANDA</span>
        </span>
        <span className='text-nowrap text-foreground'>Racing Team</span>
      </div>
    </>
  );
}
