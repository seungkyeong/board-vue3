// // 검색 데이터 모델
// export interface SearchData {
//   field: string; // 검색 필드 (예: "title", "userName")
//   value: string; // 검색 값
// }

// // 요청 Payload 모델
// export interface BoardPayload {
//   userName: string; // 사용자 이름
//   userId: string; // 사용자 ID
//   uuid: string; // UUID
//   currentPage: number; // 현재 페이지 번호
//   pageSize: number; // 페이지당 항목 수
//   body: Record<string, any>; // 추가적인 동적 데이터
//   searchData: SearchData; // 검색 데이터 (단일 객체)
// }

export function createDetailPageQuery(row) {
  return {
    sysNo: row.sysNo,
    title: row.title,
    content: row.content,
    userId: row.userId,
    userName: row.userName,
    imgPath: row.imgPath,
    createDate: row.createDate,
    modifyDate: row.modifyDate,
    view: row.view,
  }
}
// export interface DetailPageQuery {
//   sysNo: string;
//   title: string;
//   content: string;
//   userId: string;
//   userName: string;
//   imgPath: string;
//   createDate: string;
//   modifyDate: string;
//   view: string;
// }

// export interface DetailPageQuery {
//   [key: string]: string | number | null | undefined;
// }
