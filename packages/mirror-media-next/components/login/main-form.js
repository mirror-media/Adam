import styled, { css } from 'styled-components'
import { useAppSelector } from '../../hooks/useRedux'
import { loginFormMode, FormMode } from '../../slice/login-slice'
import NextImage from 'next/image'
import FormWrapper from '../shared/form-wrapper'
import MainFormStart from './main-form-start'
import MainFormRegistration from './main-form-registration'
import MainFormLoginWithPassword from './main-form-login-with-password'
import MobileBanner from '../../public/images-next/login/banner-mobile.png'
import TabletBanner from '../../public/images-next/login/banner-tablet.png'
import DesktopBanner from '../../public/images-next/login/banner-desktop.png'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SharedBannerStyles = css`
  width: 100vw;
`

const StyledMobileBanner = styled(NextImage)`
  ${SharedBannerStyles}
  display: block;
  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`

const StyledTabletBanner = styled(NextImage)`
  ${SharedBannerStyles}
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: block;
  }
  ${({ theme }) => theme.breakpoint.xxl} {
    display: none;
  }
`

const StyledDesktopBanner = styled(NextImage)`
  ${SharedBannerStyles}
  display: none;
  ${({ theme }) => theme.breakpoint.xxl} {
    display: block;
  }
`

const Intro = styled.section`
  color: #4a4a4a;
  width: auto;
  margin-top: 48px;
  margin-left: 20px;
  margin-right: 20px;

  > p {
    font-size: 18px;
    font-weight: 400;
    line-height: 150%;
  }

  ${({ theme }) => theme.breakpoint.md} {
    width: 608px;
  }

  ${({ theme }) => theme.breakpoint.xxl} {
    width: 875px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  line-height: 150%;
  text-align: center;
  margin-bottom: 16px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 20px;
  }

  ${({ theme }) => theme.breakpoint.xxl} {
    margin-bottom: 32px;
  }
`

export default function MainForm() {
  const formMode = useAppSelector(loginFormMode)

  const getFormContentByMode = () => {
    switch (formMode) {
      case FormMode.Start:
        return <MainFormStart></MainFormStart>
      case FormMode.Registration:
        return <MainFormRegistration></MainFormRegistration>
      case FormMode.Login:
        return <MainFormLoginWithPassword></MainFormLoginWithPassword>
    }
  }
  const jsx = getFormContentByMode()

  return (
    <Main>
      <StyledMobileBanner
        src={MobileBanner}
        alt="mobile banner"
      ></StyledMobileBanner>
      <StyledTabletBanner
        src={TabletBanner}
        alt="tablet banner"
      ></StyledTabletBanner>
      <StyledDesktopBanner
        src={DesktopBanner}
        alt="desktop banner"
      ></StyledDesktopBanner>
      <Intro>
        <Title>歡迎加入鏡週刊會員訂閱服務</Title>
        <p>
          在資訊爆炸與碎片的年代，新聞更需回歸純粹，讓閱讀更清澈、真實與深度。因此我們秉持明鏡之心，充份反映事實，反映時代與反映人性，持續挖掘有料內容，以一手原創題材、深度調查報導為宗旨，讓閱聽大眾獲取最完整的資訊。
        </p>
        <br />
        <p>現在，請立即加入，成為我們的會員，體驗有質量、無干擾的新聞閱讀。</p>
      </Intro>
      <FormWrapper>{jsx}</FormWrapper>
    </Main>
  )
}
