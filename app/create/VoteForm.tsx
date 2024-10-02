"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../components/ui/popover";
import { cn, nextWeek } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../../components/ui/calendar";
import { createVote } from "@/lib/actions/vote";
import { Textarea } from "../../components/ui/textarea";

const FormSchema = z
	.object({
		vote_options: z
			.array(z.string())
			.refine((value) => value.length >= 2 && value.length <= 6, {
				message:
					"You have to select at least two items and max at six items.",
			}),
		title: z
			.string()
			.min(5, { message: "Title has a minimum characters of 5" }),
		description: z.string().optional(),
		end_date: z.date(),
	})
	.refine(
		(data) => {
			const vote_options = [...new Set([...data.vote_options])];
			return vote_options.length === data.vote_options.length;
		},
		{ message: "Vote option need to be uniqe", path: ["vote_options"] }
	);

export default function VoteForm() {
	const optionRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
	const form = useForm<z.infer<typeof FormSchema>>({
		mode: "onSubmit",
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			vote_options: [],
		},
	});

	function addOptions() {
		const newOptions = optionRef.current.value.trim();

		if (newOptions) {
			if (!form.getValues("vote_options").includes(newOptions)) {
				form.setValue("vote_options", [
					...options.map((option) => option.id),
					optionRef.current.value,
				]);
				setOptions((options) => [
					...options,
					{
						id: optionRef.current.value,
						label: optionRef.current.value,
					},
				]);
				optionRef.current.value = "";
			} else {
				toast.error("You can not have the same optoin.");
			}
		}
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const vote_options: { [key: string]: number } = {};
		data.vote_options.forEach((option) => {
			vote_options[option] = 0;
		});
		const insertData = { ...data, vote_options };
		toast.promise(createVote(insertData), {
			loading: "creating...",
			success: "Successfully create a vote",
			error: "Fail to create vote",
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="vote for best of... "
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="(optional) your vote description.."
									{...field}
									className="resize-none"
								/>
							</FormControl>
							<FormDescription>
								This is be for SEO description
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="vote_options"
					render={() => (
						<FormItem>
							<div className="mb-4">
								<FormLabel className="text-base">
									Vote Options
								</FormLabel>
								<FormDescription>
									You can not edit your vote option. Please
									double check 📌.
								</FormDescription>
							</div>

							{options.map((item) => (
								<FormField
									key={item.id}
									control={form.control}
									name="vote_options"
									render={({ field }) => {
										return (
											<FormItem
												key={item.id}
												className="flex justify-between items-center py-3"
											>
												<div className="flex items-center gap-2">
													<FormControl>
														<Checkbox
															checked={field.value?.includes(
																item.id
															)}
															onCheckedChange={(
																checked
															) => {
																return checked
																	? field.onChange(
																			[
																				...field.value,
																				item.id,
																			]
																	  )
																	: field.onChange(
																			field.value?.filter(
																				(
																					value
																				) =>
																					value !==
																					item.id
																			)
																	  );
															}}
														/>
													</FormControl>
													<FormLabel className="font-normal text-lg">
														{item.label}
													</FormLabel>
												</div>
												<TrashIcon
													className="w-5 h-5 cursor-pointer hover:scale-115 transition-all"
													onClick={() => {
														setOptions((options) =>
															options.filter(
																(option) =>
																	option.id !==
																	item.id
															)
														);
													}}
												/>
											</FormItem>
										);
									}}
								/>
							))}
							<Input
								type="text"
								ref={optionRef}
								placeholder="Press enter to add more option"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addOptions();
									}
								}}
							/>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="end_date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>End date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-full pl-3 text-left font-normal",
												!field.value &&
													"text-muted-foreground"
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent
									className="w-full p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date > nextWeek() ||
											date < new Date()
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={!(options.length >= 2)}
				>
					Create
				</Button>
			</form>
		</Form>
	);
}
