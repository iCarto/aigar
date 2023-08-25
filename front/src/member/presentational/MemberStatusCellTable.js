import {MEMBER_TYPES_MAPPING} from "member/data";

const MemberStatusCellTable = ({status, showOnlyIcons = false}) => {
    const selectedType = MEMBER_TYPES_MAPPING[status];

    return selectedType ? (
        <span>
            <i className={`${selectedType.icon} mr-1`} title={selectedType.label} />{" "}
            {showOnlyIcons ? null : selectedType.label}
        </span>
    ) : null;
};

export default MemberStatusCellTable;
