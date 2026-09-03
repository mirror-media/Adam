import CustomHead from '../components/shared/custom-head'
import ErrorPage from '../components/shared/error-page'

export default function Custom500() {
  return (
    <>
      <CustomHead title="網頁無法正常運作" />
      <ErrorPage code="500" message="這個網頁無法正常運作" />
    </>
  )
}
