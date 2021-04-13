import React, {useState} from 'react';
import Clock from 'react-live-clock';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import logoImage from '../../assets/images/logo.png';
import './header.styles.scss';
const time = new Date().toLocaleTimeString();
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <div className="header">
      <div className="row row-align-center">
        <div className="col-sm-1">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>Menu</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem>Some Action</DropdownItem>
              <DropdownItem text>Dropdown Item Text</DropdownItem>
              <DropdownItem disabled>Action (disabled)</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Foo Action</DropdownItem>
              <DropdownItem>Bar Action</DropdownItem>
              <DropdownItem>Quo Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-sm-10">
          <div className="marquee">
            <div className="track">
              <div className="content">
              Gigaset Android smartphones infected with malicious system update app    Phát hiện mã độc hại Android ẩn trong ứng dụng Netflix giả mạo và lây lan qua WhatsApp
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-1">
          <div className="container-logo">
           <label className="label-timer"><Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Bangkok'} /></label>
            <img className="logo" src={logoImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
