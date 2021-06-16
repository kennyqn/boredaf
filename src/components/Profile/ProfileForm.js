import { useContext, useRef } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
    const newPasswordInputRef = useRef();
    const authContext = useContext(AuthContext);

    const history = useHistory();

    const submitHandler = event => {
        event.preventDefault();
        const enteredNewPassword = newPasswordInputRef.current.value;
        // TODO: add validation

        fetch('https://activity-suggestion-app.herokuapp.com/users/me', {
            method: 'PATCH',
            body: JSON.stringify({
                password: enteredNewPassword
            }),
            headers: {
                "Authorization": authContext.token,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            let errorMessage;
            if (!res.ok) {
                return res.json().then((data) => {
                    
                    if (data && data.error && data.error.message) {
                        errorMessage = data.error.message;
                    }
                });
            }
            history.replace('/')
            // assumption: Always succeeds!
        })
    }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef} minLength="7"/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
