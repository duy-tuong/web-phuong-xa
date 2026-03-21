"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const getRedirectPath = () => {
		if (typeof window === "undefined") {
			return "/admin";
		}

		const redirect = new URLSearchParams(window.location.search).get("redirect");
		return redirect && redirect.startsWith("/admin") ? redirect : "/admin";
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!username.trim() || !password.trim()) {
			setError("Vui long nhap day du ten dang nhap va mat khau.");
			return;
		}

		// Temporary local auth gate for admin routes until backend auth is wired.
		const token = btoa(`${username.trim()}:${Date.now()}`);
		localStorage.setItem("admin_token", token);
		localStorage.setItem("admin_display_name", username.trim());
		document.cookie = `admin_token=${token}; Path=/; Max-Age=86400; SameSite=Lax`;

		router.replace(getRedirectPath());
	};

	return (
		<section className="mx-auto mt-10 max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
			<h2 className="text-xl font-semibold text-stone-900">Dang nhap quan tri</h2>
			<p className="mt-2 text-sm text-stone-600">
				Tam thoi dung login local de vao khu vuc admin.
			</p>

			<form className="mt-6 space-y-4" onSubmit={onSubmit}>
				<div>
					<label htmlFor="username" className="mb-1 block text-sm font-medium text-stone-700">
						Ten dang nhap
					</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(event) => setUsername(event.target.value)}
						className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
						placeholder="Nhap ten dang nhap"
					/>
				</div>

				<div>
					<label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
						Mat khau
					</label>
					<div className="relative">
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="w-full rounded-md border border-stone-300 px-3 py-2 pr-10 text-sm outline-none focus:border-emerald-600"
							placeholder="Nhap mat khau"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
							aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</div>

				{error ? <p className="text-sm text-red-600">{error}</p> : null}

				<button
					type="submit"
					className="w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
				>
					Dang nhap
				</button>
			</form>
		</section>
	);
}
