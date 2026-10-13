import HomeFlow from '@/components/home/HomeFlow'
import SplashScreen from '@/components/home/SplashScreen'

export default async function HomePage(props: PageProps<'/'>) {
  // `/?pick=1` comes back from Results and goes straight to the date picker
  const { pick } = await props.searchParams
  return (
    <>
      <SplashScreen />
      <HomeFlow skipWelcome={pick !== undefined} />
    </>
  )
}
