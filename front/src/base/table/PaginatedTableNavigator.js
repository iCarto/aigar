const PaginatedTableNavigator = ({
    length,
    canPreviousPage,
    gotoPage,
    previousPage,
    pageIndex,
    pageOptions,
    canNextPage,
    nextPage,
    pageCount,
}) => {
    return (
        <div className="d-flex justify-content-between">
            <div>
                Mostrando <strong>{length}</strong> de {length}
            </div>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                    <li className={"page-item " + (!canPreviousPage ? "disabled" : "")}>
                        <button
                            type="button"
                            onClick={() => gotoPage(0)}
                            className="page-link"
                            aria-label="Primera"
                        >
                            Primera
                        </button>
                    </li>
                    <li className={"page-item " + (!canPreviousPage ? "disabled" : "")}>
                        <button
                            type="button"
                            onClick={() => previousPage()}
                            className="page-link"
                            aria-label="Anterior"
                        >
                            Anterior
                        </button>
                    </li>
                    <li className="ml-3 mr-3 mt-2">
                        Página {pageIndex + 1} de {pageOptions.length}
                    </li>
                    <li className={"page-item " + (!canNextPage ? "disabled" : "")}>
                        <button
                            type="button"
                            onClick={() => nextPage()}
                            className="page-link"
                            aria-label="Siguiente"
                        >
                            Siguiente
                        </button>
                    </li>
                    <li className={"page-item " + (!canNextPage ? "disabled" : "")}>
                        <button
                            type="button"
                            onClick={() => gotoPage(pageCount - 1)}
                            className="page-link"
                            aria-label="Última"
                        >
                            Última
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default PaginatedTableNavigator;
