const copyrightYear = new Date().getFullYear();

const Footer = () => {
    return (
        <>
        <footer className="absolute bottom-0 w-full flex justify-center-safe text-white text-shadow-[2px_2px_1px_#000000] z-20">
            <p>Copyright &#169; {copyrightYear} Philippines | All rights reserved.</p>
        </footer>
        </>
    )
}

export default Footer