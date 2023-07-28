import {useState} from "react";
import {
    SortedTable,
    EditableTextCellTable,
    EditableSelectCellTable,
    LinkCellTable,
} from "base/table";
import {MemberViewModal} from "member/presentational";

const LoadMeasurementsList = ({measurements, onUpdateMeasurement}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberForModal, setSelectedMemberForModal] = useState(null);

    const handleClickViewMember = num_socio => {
        setIsModalOpen(true);
        setSelectedMemberForModal(num_socio);
    };

    const onClickCancelViewMember = () => {
        setIsModalOpen(false);
        setSelectedMemberForModal(null);
    };

    const modal = (
        <MemberViewModal
            num_socio={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={onClickCancelViewMember}
        />
    );

    if (measurements) {
        const columns = [
            {
                Header: "Socio",
                accessor: d => `${d.num_socio} - ${d.nombre_socio}`,
                Cell: LinkCellTable,
                getProps: () => ({
                    handleClick: handleClickViewMember,
                    linkAccessor: "num_socio",
                }),
            },
            {
                Header: "Sector",
                accessor: "sector",
            },
            {
                Header: "Medidor",
                accessor: "medidor",
                Cell: EditableTextCellTable,
            },
            {
                Header: "Cambio medidor",
                accessor: "cambio_medidor",
                Cell: EditableSelectCellTable,
            },
            {
                Header: "Lectura anterior",
                accessor: "caudal_anterior",
            },
            {
                Header: "Lectura actual",
                accessor: "caudal_actual",
                Cell: EditableTextCellTable,
            },
            {
                Header: "Consumo",
                accessor: "consumo",
            },
        ];

        return (
            <>
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable
                        columns={columns}
                        data={measurements}
                        onUpdateData={onUpdateMeasurement}
                    />
                </div>
                {modal}
            </>
        );
    }

    return null;
};

export default LoadMeasurementsList;
