type RGBAColor = [number, number, number, number];

const hexToRgba = (hex: string): RGBAColor => {
  const sanitizedHex = hex.replace('#', '');

  // 각 색상 채널을 16진수에서 10진수로 변환
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  return [r, g, b, 255]; // 255 불투명도는 일단 255로 고정
};

export const floodFill = (
  canvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  fillColor: string // 헥사코드 색상을 인수로 받습니다.
): void => {
  const context = canvas.getContext('2d');

  // 2D 렌더링 컨텍스트를 가져오지 못한 경우, 함수 실행 중단
  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;

  // 헥사코드 색상을 RGBA로 변환
  const rgbaFillColor = hexToRgba(fillColor);

  // 캔버스의 전체 픽셀 데이터
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 시작 좌표의 색상
  const targetColor = getColorAtPixel(data, startX, startY, width);

  // 만약 채우려는 색상이 현재 색상과 동일하다면, 함수 실행 중단
  if (colorsMatch(targetColor, rgbaFillColor)) {
    return;
  }

  // 채워야 할 좌표 목록을 저장하는 배열
  const pixelsToCheck: [number, number][] = [[startX, startY]];
  const checkedPixels = new Set<string>();

  // 채울 좌표가 더 이상 없을 때까지 반복
  while (pixelsToCheck.length > 0) {
    const [x, y] = pixelsToCheck.pop()!;

    // 현재 좌표가 이미 처리되었으면 넘어갑니다.
    const pixelKey = `${x},${y}`;
    if (checkedPixels.has(pixelKey)) {
      continue;
    }
    checkedPixels.add(pixelKey);

    // 유효한 좌표인지 확인
    if (x < 0 || x >= width || y < 0 || y >= height) {
      continue; // 유효하지 않은 좌표는 넘어갑니다.
    }

    const currentColor = getColorAtPixel(data, x, y, width);

    // 현재 좌표의 색상이 타겟 색상과 다르면 다음 좌표로 넘어감
    if (!colorsMatch(currentColor, targetColor)) {
      continue;
    }

    // 현재 좌표의 색상을 채울 색상으로 설정
    setColorAtPixel(data, x, y, rgbaFillColor, width);

    // 상하좌우 인접한 좌표를 pixelsToCheck 배열에 추가
    pixelsToCheck.push([x - 1, y]); // 왼쪽
    pixelsToCheck.push([x + 1, y]); // 오른쪽
    pixelsToCheck.push([x, y - 1]); // 위
    pixelsToCheck.push([x, y + 1]); // 아래
  }

  // 수정된 이미지 데이터를 캔버스에 다시 그림
  context.putImageData(imageData, 0, 0);
};

const getColorAtPixel = (data: Uint8ClampedArray, x: number, y: number, width: number): RGBAColor => {
  // (x, y) 좌표에 해당하는 데이터 배열의 시작 인덱스 계산
  const index = (y * width + x) * 4;
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
};

const setColorAtPixel = (data: Uint8ClampedArray, x: number, y: number, fillColor: RGBAColor, width: number): void => {
  // (x, y) 좌표에 해당하는 데이터 배열의 시작 인덱스 계산
  const index = (y * width + x) * 4;
  data[index] = fillColor[0]; // R
  data[index + 1] = fillColor[1]; // G
  data[index + 2] = fillColor[2]; // B
  data[index + 3] = fillColor[3]; // A
};

const colorsMatch = (color1: RGBAColor, color2: RGBAColor): boolean => {
  return (
    color1[0] === color2[0] && // R
    color1[1] === color2[1] && // G
    color1[2] === color2[2] && // B
    color1[3] === color2[3] // A
  );
};

export default floodFill;
