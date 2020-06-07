import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import React, { useRef, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '10px',
    borderRight: '1px solid darkgrey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    resize: 'none',
    backgroundColor: 'white',
    borderTopLeftRadius: '999px',
    borderBottomLeftRadius: '999px',
  },
}));

const EmojiInput = ({ value, onSelection }) => {
  const [showPicker, setPickerState] = useState(false);
  const picker = useRef(null);

  const classes = useStyles();

  const dismissPicker = useCallback(() => {
    setPickerState(false);
  }, [setPickerState]);

  const togglePicker = () => {
    setPickerState(!showPicker);
  };
  const addEmoji = (emoji) => {
    if ('native' in emoji) {
      onSelection(`${value}${emoji.native}`);
      dismissPicker();
    }
  };
  return (
    <div ref={picker} className={classes.root}>
      {/* <Dialog> */}
      {showPicker && (
        <Picker
          emoji=""
          title=""
          onSelect={addEmoji}
          style={{ position: 'absolute', left: '20px', bottom: '60px' }}
        />
      )}
      {/* </Dialog> */}
      <button
        aria-label="😀, grinning"
        className="emoji-mart-emoji"
        type="button"
        style={{ outline: 'none' }}
        onClick={togglePicker}>
        <span
          style={{
            width: '24px',
            height: '24px',
            display: 'inline-block',
            backgroundImage: `url("https://unpkg.com/emoji-datasource-apple@5.0.1/img/apple/sheets-256/64.png")`,
            backgroundSize: '5700% 5700%',
            backgroundPosition: '53.5714% 62.5%',
          }}></span>
      </button>
    </div>
  );
};

export default EmojiInput;
