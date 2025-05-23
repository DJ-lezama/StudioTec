import React from "react"

const FooterStudioTec = () => {
    return (
        <footer className="w-full bg-textMain text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Texto */}
                <p className="text-sm font-normal text-center sm:text-left font-['Plus Jakarta Sans']">
                    StudioTec @ 2025. Todos los derechos reservados.
                </p>

                {/* Íconos sociales */}
                <div className="flex justify-center sm:justify-end items-center gap-6">
                    {/* Facebook */}
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M9.04598 5.865V8.613H7.03198V11.973H9.04598V21.959H13.18V11.974H15.955C15.955 11.974 16.215 10.363 16.341 8.601H13.197V6.303C13.197 5.96 13.647 5.498 14.093 5.498H16.347V2H13.283C8.94298 2 9.04598 5.363 9.04598 5.865Z"
                                fill="currentColor"
                            />
                        </svg>
                    </a>

                    {/* Instagram */}
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M16.017 2H7.947C6.37015 2.00185 4.85844 2.62914 3.74353 3.74424C2.62862 4.85933 2.00159 6.37115 2 7.948L2 16.018C2.00185 17.5948 2.62914 19.1066 3.74424 20.2215C4.85933 21.3364 6.37115 21.9634 7.948 21.965H16.018C17.5948 21.9631 19.1066 21.3359 20.2215 20.2208C21.3364 19.1057 21.9634 17.5938 21.965 16.017V7.947C21.9631 6.37015 21.3359 4.85844 20.2208 3.74353C19.1057 2.62862 17.5938 2.00159 16.017 2V2ZM19.957 16.017C19.957 16.5344 19.8551 17.0468 19.6571 17.5248C19.4591 18.0028 19.1689 18.4371 18.803 18.803C18.4371 19.1689 18.0028 19.4591 17.5248 19.6571C17.0468 19.8551 16.5344 19.957 16.017 19.957H7.947C6.90222 19.9567 5.90032 19.5415 5.16165 18.8026C4.42297 18.0638 4.008 17.0618 4.008 16.017V7.947C4.00827 6.90222 4.42349 5.90032 5.16235 5.16165C5.90122 4.42297 6.90322 4.008 7.948 4.008H16.018C17.0628 4.00827 18.0647 4.42349 18.8034 5.16235C19.542 5.90122 19.957 6.90322 19.957 7.948V16.018V16.017Z"
                                fill="currentColor"
                            />
                            <path
                                d="M11.9819 6.81885C10.6134 6.82096 9.30148 7.36563 8.33385 8.33345C7.36621 9.30127 6.8218 10.6133 6.81995 11.9818C6.82153 13.3508 7.36597 14.6632 8.33385 15.6312C9.30172 16.5993 10.614 17.144 11.9829 17.1458C13.352 17.1443 14.6646 16.5997 15.6327 15.6316C16.6008 14.6635 17.1454 13.3509 17.1469 11.9818C17.1448 10.6129 16.5999 9.30073 15.6316 8.33304C14.6634 7.36535 13.3509 6.82117 11.9819 6.81985V6.81885ZM11.9819 15.1378C11.1452 15.1378 10.3427 14.8054 9.75102 14.2138C9.15935 13.6221 8.82695 12.8196 8.82695 11.9828C8.82695 11.1461 9.15935 10.3436 9.75102 9.75193C10.3427 9.16025 11.1452 8.82785 11.9819 8.82785C12.8187 8.82785 13.6212 9.16025 14.2129 9.75193C14.8045 10.3436 15.1369 11.1461 15.1369 11.9828C15.1369 12.8196 14.8045 13.6221 14.2129 14.2138C13.6212 14.8054 12.8187 15.1378 11.9819 15.1378Z"
                                fill="currentColor"
                            />
                            <path
                                d="M17.1559 8.09509C17.8391 8.09509 18.3929 7.54127 18.3929 6.85809C18.3929 6.17492 17.8391 5.62109 17.1559 5.62109C16.4728 5.62109 15.9189 6.17492 15.9189 6.85809C15.9189 7.54127 16.4728 8.09509 17.1559 8.09509Z"
                                fill="currentColor"
                            />
                        </svg>
                    </a>

                    {/* Twitter/X */}
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.9442 7.29287C19.9569 7.49357 19.9569 7.69428 19.9569 7.89499C19.9569 13.8513 15.8326 20.7489 7.70772 20.7489C5.09772 20.7489 2.67257 19.9888 0.640259 18.6744C1.01231 18.7173 1.37161 18.7388 1.74366 18.7388C3.86538 18.7388 5.81167 18.0002 7.35337 16.7501C5.35123 16.7072 3.67553 15.3928 3.08257 13.5785C3.36772 13.6214 3.65287 13.6429 3.95077 13.6429C4.37869 13.6429 4.80662 13.5999 5.20917 13.5141C3.12116 13.0998 1.56672 11.2426 1.56672 9.01277V8.94831C2.18527 9.29156 2.89945 9.49227 3.65287 9.51372C2.43527 8.69935 1.63771 7.32645 1.63771 5.77173C1.63771 4.93591 1.8478 4.16461 2.21984 3.50156C4.44579 6.22174 7.78128 8.04884 11.5144 8.24954C11.4434 7.90629 11.3978 7.54159 11.3978 7.17689C11.3978 4.67806 13.4252 2.63623 15.9449 2.63623C17.2536 2.63623 18.4456 3.18908 19.2939 4.09908C20.3425 3.90693 21.3404 3.52934 22.237 3.02364C21.8934 4.05615 21.1536 4.936 20.1811 5.48885C21.1282 5.38878 22.0502 5.13092 22.9062 4.78767C22.2371 5.68031 21.4039 6.54175 20.4669 7.22025C19.9442 7.29287 19.9442 7.29287 19.9442 7.29287Z"
                                fill="currentColor"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default FooterStudioTec
