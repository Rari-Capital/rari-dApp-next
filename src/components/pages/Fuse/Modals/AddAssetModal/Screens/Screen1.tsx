// Chakra and UI
import { Row } from "lib/chakraUtils";
import { Dispatch, SetStateAction } from "react";

// Components
import AssetConfig from "../AssetConfig";

const Screen1 = ({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Row
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        overflowY="scroll"
        maxHeight="100%"
        height="95%"
        width="100%"
        maxWidth="100%"
        id="SCREEN1COLUMN"
      >
        <AssetConfig checked={checked} setChecked={setChecked} />
      </Row>
    </>
  );
};

export default Screen1;
