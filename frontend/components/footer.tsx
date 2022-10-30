import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
    return (
        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
            <div>
                <p>Non-official website</p>
                <a href="https://github.com/markbeep/ASVZ-Graph-Website">
                    <div className='flex flex-row'>
                        <p>Source on Github</p>
                        <GitHubIcon className='ml-2' />
                    </div>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
