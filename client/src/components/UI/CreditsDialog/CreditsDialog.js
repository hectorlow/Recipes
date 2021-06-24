import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import starCheckedIcon from 'images/star_checked.png';
import starUncheckedIcon from 'images/star_unchecked.png';
import autumnSoup from 'images/autumn_soup.jpg';
import avocadoAndEgg from 'images/avocado_and_egg.jpg';
import foodTray from 'images/food-tray.png';
import pizzaSlice from 'images/pizza.png';
import recipeBook from 'images/recipe-book.png';
import './CreditsDialog.scss';

const CreditsDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} scroll="body">
      <DialogTitle id="scroll-dialog-title">Credits</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div className="CreditsDialog__credit CreditsDialog__flex-row">
            <img className="CreditsDialog__icon" src={starCheckedIcon} alt="" />
            <div>
              by{' '}
              <a
                href="https://www.flaticon.com/authors/pixel-perfect"
                title="Pixel perfect"
              >
                Pixel perfect
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </div>
          </div>
          <div className="CreditsDialog__credit CreditsDialog__flex-row">
            <img
              className="CreditsDialog__icon"
              src={starUncheckedIcon}
              alt=""
            />
            <div>
              by{' '}
              <a
                href="https://www.flaticon.com/authors/smashicons"
                title="Smashicons"
              >
                Smashicons
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </div>
          </div>
          <div className="CreditsDialog__credit CreditsDialog__flex-row">
            <img className="CreditsDialog__icon" src={recipeBook} alt="" />
            <img className="CreditsDialog__icon" src={pizzaSlice} alt="" />
            <div>
              by{' '}
              <a href="https://www.freepik.com" title="Freepik">
                Freepik
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </div>
          </div>

          {/* Images */}
          <div className="CreditsDialog__credit CreditsDialog__flex-row">
            <img className="CreditsDialog__picture" src={foodTray} alt="" />
            <div>
              by{' '}
              <a
                href="https://www.flaticon.com/authors/good-ware"
                title="Good Ware"
              >
                Good Ware
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </div>
          </div>
          <div>
            <img
              className="CreditsDialog__large-picture"
              src={autumnSoup}
              alt=""
            />
            <div className="CreditsDialog__credit">
              by Cala from{' '}
              <a
                href="https://unsplash.com/photos/w6ftFbPCs9I"
                title="Flaticon"
              >
                https://unsplash.com/photos/w6ftFbPCs9I
              </a>
            </div>
          </div>
          <div className="CreditsDialog__credit">
            <img
              className="CreditsDialog__large-picture"
              src={avocadoAndEgg}
              alt=""
            />
            <div>
              by Joseph Gonzalez from{' '}
              <a
                href="https://unsplash.com/photos/fdlZBWIP0aM"
                title="Flaticon"
              >
                https://unsplash.com/photos/fdlZBWIP0aM
              </a>
            </div>
          </div>
{/* 
          <img className="CreditsDialog__icon" src={starUncheckedIcon} alt="" />
          <img className="CreditsDialog__icon" src={recipeBook} alt="" />
          <img className="CreditsDialog__icon" src={pizzaSlice} alt="" />
          <img className="CreditsDialog__picture" src={foodTray} alt="" />
          <img className="CreditsDialog__picture" src={autumnSoup} alt="" />
          <img className="CreditsDialog__picture" src={avocadoAndEgg} alt="" /> */}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

CreditsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreditsDialog;
