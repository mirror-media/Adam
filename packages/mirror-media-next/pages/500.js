import ErrorPage from '../components/shared/error-page'

export default function Custom500() {
  return <ErrorPage code="500" message="這個網頁無法正常運作" />
}
