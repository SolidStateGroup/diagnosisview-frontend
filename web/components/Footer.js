import React  from 'react'; // we need this to make JSX compile


const TheComponent = ({fixed, light}) => {
    return (
        <footer className={"footer flex row " + (fixed ? "fixed ":"") + (light && "light")}>
            <div className="text-right float-right">
                <a target="_blank" className="footer__link mr-4" href='https://blogs.ed.ac.uk/diagnosisview'>Help & About</a>
                <Link className="footer__link mr-4" to='/privacy-policy'>Privacy Policy</Link>
                <Link className="footer__link mr-4" to='/accessibility-policy'>Accessibility Policy</Link>
                <Link className="footer__link mr-4" to='/terms-of-use'>Terms of Use</Link>
            </div>
        </footer>
    )
}

export default TheComponent
