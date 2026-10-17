// *Định nghĩa interface NormalizedSearch để chuẩn hóa dữ liệu tìm kiếm trong ứng dụng học tiếng Trung. Nó bao gồm các thuộc tính để lưu trữ chuỗi gốc, chuỗi đã được loại bỏ khoảng trắng, xác định xem chuỗi có phải là ký tự Hán tự hay không, và các phiên bản đã được chuẩn hóa của Pinyin và tiếng Việt.
// *những hàm chuẩn hóa này không có sẵn và chúng ta cần tự viết các hàm chuẩn hóa để loại bỏ dấu, số và ký tự đặc biệt từ Pinyin và tiếng Việt. Ví dụ, chúng ta có thể viết một hàm normalizePinyin để loại bỏ dấu và số từ chuỗi Pinyin, và một hàm normalizeVietnamese để loại bỏ dấu và ký tự đặc biệt từ chuỗi tiếng Việt.
export interface NormalizedSearch{
    original: string; // Chuỗi gốc trước khi người dùng nhập vào chưa chỉnh sửa (ví dụ: " 你好 ")
    trimmed: string; // Chuỗi đã được loại bỏ khoảng trắng thừa ở đầu và cuối (ví dụ: "你好")
    isHanzi: boolean; // Xác định xem chuỗi đã được chuẩn hóa có phải là ký tự Hán tự hay không (ví dụ: true nếu là "你好", false nếu là "ni hao")
    cleanPinyin: string; // Chuỗi Pinyin đã được chuẩn hóa, loại bỏ dấu và số (ví dụ: "ni hao" từ "nǐ hǎo")
    cleanVietnamese: string; // Chuỗi tiếng Việt đã được chuẩn hóa, loại bỏ dấu và ký tự đặc biệt (ví dụ: "xin chao" từ "xin chào")
}
export function isHanzi(str: string): boolean {
    // Kiểm tra xem chuỗi có chứa ký tự Hán tự hay không bằng cách sử dụng biểu thức chính quy
    return /[\u4e00-\u9fff]/.test(str);
}
// Hàm biến "Học sinh" thành "hoc sinh"
export function removeVietnameseAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ|Đ/g, "d").toLowerCase(); 
}
// Hàm biến "nǐ hǎo" thành "ni hao"
export function removePinyinTones(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[0-9]/g, "").toLowerCase(); 
}
export function normalizeSearchQuery(query: string): NormalizedSearch {
    const original = query || ""; // Nếu query là null hoặc undefined, gán giá trị mặc định là chuỗi rỗng còn nếu query là một chuỗi hợp lệ, gán giá trị của nó cho original.
    const trimmed = original.trim();
    const isHanziQuery = isHanzi(trimmed);
    if (isHanziQuery) {
        return {
            original,
            trimmed,
            isHanzi: true,
            cleanPinyin: "",
            cleanVietnamese: "",
        };
    } else {
        const cleanPinyin = removePinyinTones(trimmed);
        const cleanVietnamese = removeVietnameseAccents(trimmed);
        return {
            original,
            trimmed,
            isHanzi: false,
            cleanPinyin,
            cleanVietnamese,
        };
    } 
}