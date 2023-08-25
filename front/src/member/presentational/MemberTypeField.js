import {MEMBER_TYPES_MAPPING} from "member/data";

const MemberTypeField = ({memberType}) => {
    const selectedType = MEMBER_TYPES_MAPPING[memberType];

    return selectedType ? (
        <span>
            <i className={`${selectedType.icon} mr-2`} /> {selectedType.label}
        </span>
    ) : null;
};

export default MemberTypeField;
