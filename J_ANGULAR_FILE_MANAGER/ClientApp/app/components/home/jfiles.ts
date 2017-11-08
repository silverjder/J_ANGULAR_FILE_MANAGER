// 인터페이스 : 테이불 => 모델클래스 => TS인터페이스
export interface JFiles {
    type: string;
    label: string;
    data: string;
    expandedIcon: string;
    collapsedIcon: string;
    leaf: boolean;
    icon: string;
    typem: string;
    size: string;
}

// 모델클래스
export class JFilesModel {
    constructor(
        public type: string,
        public label: string,
        public data: string,
        public expandedIcon: string,
        public collapsedIcon: string,
        public leaf: boolean,
        public icon: string,
        public typem: string,
        public size: string
    ) { }
};

// 페이징 처리를 위한 한버에 2개의 정보를 반환하는 뷰 모델 인터 페이스 
export interface IPagedViewModel<T> {
    totalRecordCount: number;
    records: T;
}