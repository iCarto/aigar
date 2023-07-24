import React from "react";

class PaginatedTableNavigator extends React.Component {
    render() {
        return (
            <div className="d-flex justify-content-between">
                <div>
                    Mostrando <strong>{this.props.length}</strong> de{" "}
                    {this.props.length}
                </div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                        <li
                            className={
                                "page-item " +
                                (!this.props.canPreviousPage ? "disabled" : "")
                            }
                        >
                            <button
                                type="button"
                                onClick={() => this.props.gotoPage(0)}
                                className="page-link"
                                aria-label="Primera"
                            >
                                Primera
                            </button>
                        </li>
                        <li
                            className={
                                "page-item " +
                                (!this.props.canPreviousPage ? "disabled" : "")
                            }
                        >
                            <button
                                type="button"
                                onClick={() => this.props.previousPage()}
                                className="page-link"
                                aria-label="Anterior"
                            >
                                Anterior
                            </button>
                        </li>
                        <li className="ml-3 mr-3 mt-2">
                            Página {this.props.pageIndex + 1} de{" "}
                            {this.props.pageOptions.length}
                        </li>
                        <li
                            className={
                                "page-item " +
                                (!this.props.canNextPage ? "disabled" : "")
                            }
                        >
                            <button
                                type="button"
                                onClick={() => this.props.nextPage()}
                                className="page-link"
                                aria-label="Siguiente"
                            >
                                Siguiente
                            </button>
                        </li>
                        <li
                            className={
                                "page-item " +
                                (!this.props.canNextPage ? "disabled" : "")
                            }
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    this.props.gotoPage(this.props.pageCount - 1)
                                }
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
    }
}

export default PaginatedTableNavigator;
