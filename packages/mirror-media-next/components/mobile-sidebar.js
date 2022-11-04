import styled from 'styled-components'
import { useState } from 'react'
const SideBarButton = styled.button`
  user-select: none;
  display: block;
  margin-left: 16px;
  &:focus {
    border: none;
    outline: none;
  }
  .hamburger {
    width: 16px;
    height: 2px;
    background-color: black;
    margin: 2px 0;
    border-radius: 12px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const SideBar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  background-color: #054f77;
  z-index: 99999999;
  ${SideBarButton} {
    width: 28px;
    height: 28px;
    padding: 4px;
    display: flex;
    position: absolute;
    top: 0px;
    right: 0px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    div {
      border: 1px solid #fff;
      border-radius: 50%;
      height: 20px;
      width: 20px;
      margin: 0 auto;
      position: relative;
      &:before,
      :after {
        position: absolute;
        left: 8.5px;
        top: 5px;
        transform: translate(-50%, -50%);
        content: ' ';
        height: 8.5px;
        width: 1.2px;
        background-color: #fff;
      }
      &:before {
        transform: rotate(45deg);
      }
      &:after {
        transform: rotate(-45deg);
      }
    }
  }
`
export default function MobileSidebar() {
  const [openSidebar, setOpenSidebar] = useState(false)
  return (
    <>
      <SideBarButton onClick={() => setOpenSidebar((val) => !val)}>
        <div className="hamburger"></div>
        <div className="hamburger"></div>
        <div className="hamburger"></div>
      </SideBarButton>
      {openSidebar && (
        <SideBar>
          <button
            className="close"
            onClick={() => setOpenSidebar((val) => !val)}
          >
            <SideBarButton>
              <div></div>
            </SideBarButton>
          </button>
        </SideBar>
      )}
    </>
  )
}
