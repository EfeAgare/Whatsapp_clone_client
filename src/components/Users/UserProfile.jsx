import React, { useCallback, Fragment, useState } from 'react';
import { NavBar } from '../common/NavBar';
import { Container, Title } from '../common/ContainerStyle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BackButton } from '../ChatCreationScreen/ChatCreationNavbar';
import { makeStyles } from '@material-ui/core/styles';
import { useMe } from '../../services/auth.service';
import { TextField } from '@material-ui/core';
import { updateUserMutation } from '../../graphQl/mutations/updateProfileMutation';
import { useMutation } from 'react-apollo';
import { toast } from 'react-toastify';

const useStyles = makeStyles({
  root: {
    '& > *': {
      margin: ' 8px',
      width: '25ch',
    },
  },
});

export const UserProfile = ({ history }) => {
  const classes = useStyles();

  const [file, setFile] = useState(null);
  const [fileChanged, setFileChanged] = useState(null);

  const userDetails = useMe();

  const [form, setState] = useState({
    name: userDetails.name,
    username: userDetails.username,
    aboutMe: userDetails.aboutme,
    file: file ? file : userDetails.picture,
  });

  const navBack = useCallback(() => {
    history.replace('/chats');
  }, [history]);

  const handleImageChange = async (e) => {
    if (e.target?.files[0]) {
      setFile(URL.createObjectURL(e.target?.files[0]));
      setState({
        ...form,
        file: e.target.files[0],
      });
      setFileChanged(true);
    }
  };

  const updateField = (e) => {
    setState({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [updateUser] = useMutation(updateUserMutation, {
    onCompleted({ updateUser }) {
      toast.success('Profile updated successfully');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (fileChanged) {
      updateUser({
        variables: {
          name: form.name,
          username: form.username,
          aboutme: form.aboutMe,
          file: form.file,
        },
      });
    } else {
      updateUser({
        variables: {
          name: form.name,
          username: form.username,
          aboutme: form.aboutMe,
        },
      });
    }
  };

  return (
    <Fragment>
      <Container>
        <BackButton onClick={navBack}>
          <ArrowBackIcon />
        </BackButton>
        <Title>Editing {userDetails.name}</Title>
        <NavBar />
      </Container>
      <div className="card">
        <div className="submit-icon">
          <button onClick={handleSubmit}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <div className="image-container">
          <img src={file ? file : userDetails.picture} alt="John" />
          <input
            type="file"
            name="file"
            accept=".png, .jpg, .jpeg"
            className="custom-file-input"
            onChange={handleImageChange}
          />
        </div>

        <h4 style={{ textTransform: 'capitalize' }}>{userDetails.username}</h4>
        <div style={{ margin: '24px 0' }}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="standard-basic"
              label="Username"
              name="username"
              value={form.username}
              onChange={updateField}
            />
            <TextField
              id="standard-basic"
              label="Name"
              name="name"
              value={form.name}
              onChange={updateField}
            />
            <TextField
              id="standard-basic"
              label="About me"
              name="aboutMe"
              value={form.aboutMe}
              onChange={updateField}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};
