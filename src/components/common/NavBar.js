import React, { useState, useCallback, Fragment } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import styled from 'styled-components';
import { Button, ClickAwayListener } from '@material-ui/core';
import { Link } from 'react-router-dom';

const ParentButton = styled(Button)`
  color: var(--primary-text) !important;
`;

export const NavBar = ({ history }) => {
  const [signingOut, setSigningOut] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(null);
  };

  const handleSignOut = useCallback(() => {
    setSigningOut(true);
  }, [setSigningOut]);

  if (signingOut) {
    localStorage.removeItem('token');
    history.replace('/sign-in');
  }

  return (
    <Fragment>
      <ParentButton
        aria-haspopup="true"
        aria-controls="simple-menu"
        onClick={handleClick}>
        <MoreVertIcon />
      </ParentButton>

      {menuOpen && (
        <ClickAwayListener onClickAway={handleClose}>
          <div className="dropdown-content">
            <Link to="/user/1">Update Profile</Link>
            <Link to="#" onClick={handleSignOut}>
              Logout
            </Link>
          </div>
        </ClickAwayListener>
      )}
    </Fragment>
  );
};
