import Header from "../../components/landingpage/landingpage-header";
import "./landingpage-header.css";
import "./landingpage-main.css";
import "./landingpage-footer.css";
import { Home,AboutUs,Features } from "../../components/landingpage/landingpage-main";
import Footer from "../../components/landingpage/landingpage-footer";
const LandingPage = () =>{
    return(
    <div className="landing-page">
        <Header/>
        <Home />
        <AboutUs/>
        <Features/>
        <Footer/>
    </div>
);
}
export default LandingPage;