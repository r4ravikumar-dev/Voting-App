import React from "react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { SiYoutube } from "react-icons/si";
import Link from "next/link";
export default function Footer() {
	return (
		<footer className=" border-t-[0.5px] py-10 flex items-center justify-center flex-col gap-5">
			<div className="flex items-center gap-2">
				<Link href="https://github.com/r4ravikumar-dev" target="_blank">
					<GitHubLogoIcon className="w-5 h-5 hover:scale-125 transition-all" />
				</Link>
				<Link
					href="https://www.linkedin.com/in/r4ravikumar"
					target="_blank"
				>
					<LinkedInLogoIcon className="w-5 h-5 hover:scale-125 transition-all" />
				</Link>
				<Link
					href="https://www.instagram.com/_jha.ravi"
					target="_blank"
				>
					<SiYoutube className="w-5 h-5 hover:scale-125 transition-all" />
				</Link>
			</div>
			<h1 className="text-sm">
				This site is designed and developed by <a href="https://www.graphikx.in" className="underline">Graphikx India</a>
			</h1>
			<h1 className="text-sm -mt-4">
				&copy; 2024 Graphikx. All right reserved
			</h1>
		</footer>
	);
}
