"use client";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export async function swalConfirm(message: string, confirmButtonText = "ยืนยัน") {
	const result = await Swal.fire({
		text: message,
		icon: "question",
		showCancelButton: true,
		confirmButtonText,
		cancelButtonText: "ยกเลิก",
		focusCancel: true,
	});
	return result.isConfirmed;
}

export function swalSuccess(message: string, title = "สำเร็จ") {
	return Swal.fire({
		title,
		text: message,
		icon: "success",
		confirmButtonText: "ตกลง",
	});
}

export function swalError(message: string, title = "เกิดข้อผิดพลาด") {
	return Swal.fire({
		title,
		text: message,
		icon: "error",
		confirmButtonText: "ตกลง",
	});
}

export function swalWarning(message: string, title = "โปรดตรวจสอบ") {
	return Swal.fire({
		title,
		text: message,
		icon: "warning",
		confirmButtonText: "ตกลง",
	});
}

export function toastSuccess(message: string) {
	return Swal.fire({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		icon: "success",
		title: message,
		timer: 2000,
		timerProgressBar: true,
	});
}

export function toastError(message: string) {
	return Swal.fire({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		icon: "error",
		title: message,
		timer: 2500,
		timerProgressBar: true,
	});
}


