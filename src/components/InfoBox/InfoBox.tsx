const InfoBox: React.FC = () => {
  return (
    <>
      <ul className="text-muted-foreground text-sm">
        <li>Drag and drop your image onto the canvas to position it.</li>
        <li>캔버스 너비: 사용자가 캔버스의 너비를 조정할 수 있습니다.</li>
        <li>캔버스 높이: 사용자가 캔버스의 높이를 조정할 수 있습니다.</li>
        <li>그리드 크기: 사용자가 그리드 블록의 크기를 조정할 수 있습니다.</li>
        <li>그리드 색상: 그리드 선의 색상을 선택할 수 있습니다.</li>
        <li>
          이미지 투명도: 캔버스에 업로드된 이미지의 투명도를 조정할 수 있습니다.
        </li>
        <li>
          블록을 보여줄 최소 줌 레벨: 특정 줌 레벨 이상에서만 그리드 블록이
          표시되도록 설정합니다.
        </li>
        <li>줌 속도: 사용자가 줌 인/아웃의 속도를 조정할 수 있습니다.</li>
        <li>
          드래그 활성화 여부: 사용자가 드래그 기능을 활성화하거나 비활성화할 수
          있습니다.
        </li>
      </ul>
    </>
  );
};

export default InfoBox;
