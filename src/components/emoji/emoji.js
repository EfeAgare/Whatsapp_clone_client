import 'emoji-mart/css/emoji-mart.css';
import { Picker, EmojiData } from 'emoji-mart';
import { useRef } from 'react';

const EmojiInput = ({ value, onSelection }) => {
  const [showPicker, setPickerState] = useState(false);
  const picker = useRef(null);
  const dismissPicker = useCallback(() => {
    setPickerState(false);
  }, [setPickerState]);

  useClickOutside([picker], dismissPicker);

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
    <div ref={picker}>
      {/* <Dialog> */}
      {showPicker && <Picker emoji="" title="" onSelect={addEmoji} />}
      {/* </Dialog> */}
      <EmojiButton onClick={togglePicker} />
    </div>
  );
};
