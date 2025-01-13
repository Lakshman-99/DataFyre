import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from './redux/language-slice';
import { AppState, AppDispatch } from './redux/store';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//import { toggleLogin } from './store/landingpage-slice';
import LandingPage from './pages/landingpage/landing-page';

function App() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: AppState) => state.language.language);
  //const loggedIn = useSelector((state: any) => state.landingPage.loggedIn);
  // Change language function
  const changeLanguage = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  // const handleLoginToggle = () => {
  //   dispatch(toggleLogin());
  // };

  return (
    <div>
      <LandingPage/>
      {/* <button onClick={handleLoginToggle}>
        {loggedIn ? "Logout" : "Login"}
      </button> */}

      {/* <div>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('ta')}>தமிழ்</button>
        <Link to="/login">Change</Link>
      </div>
      <p>Current Language: {language}</p> */}
    </div>
  );
}

export default App;
