import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, BadgeCheck, Pencil, Eye } from "lucide-react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/lib/type";
import { formatDate, formatDay } from "@/lib/formats";

const fetchNewsById = async (id: string): Promise<Post> => {
    const { data } = await api.get(`/news/${id}`);
    return data;
};

const NewsDetails = () => {
    const { id } = useParams<{ id: string }>();

    const { data: post, isLoading } = useQuery({
        queryKey: ["news", id],
        queryFn: () => fetchNewsById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <p className="text-muted-foreground font-body">Loading...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-64 gap-4">
                <p className="text-muted-foreground font-body">News not found.</p>
                <Button asChild variant="outline" className="rounded-sm font-body">
                    <Link to="/all-news">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to All News
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            {/* Back + Edit */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-sm font-body -ml-2"
                >
                    <Link to="/all-news">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to All News
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-sm font-body"
                >
                    <Link to={`/edit-news/${post.slug}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="bg-card border border-border rounded-sm overflow-hidden">
                            <img
                                src={post.featuredImage}
                                alt={post.bnTitle}
                                className="w-full h-56 sm:h-72 object-cover"
                            />
                            {post.imageCaption && (
                                <p className="text-xs text-muted-foreground font-body p-3 border-t border-border">
                                    {post.imageCaption}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Title & Meta */}
                    <div className="bg-card border border-border rounded-sm p-5">
                        {/* Status + Category */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge
                                variant={post.status === "published" ? "default" : "secondary"}
                                className={`rounded-sm text-xs ${post.status === "published"
                                    ? "bg-success text-success-foreground"
                                    : "bg-blue-500 text-success-foreground"
                                    }`}
                            >
                                {post.status === "published" ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline" className="rounded-sm text-xs font-body">
                                {post.categoryBN}
                            </Badge>
                            <Badge variant="outline" className="rounded-sm text-xs font-body">
                                {post.categoryEN}
                            </Badge>
                        </div>

                        {/* Bengali Title */}
                        <h1 className="text-2xl font-bold font-heading text-foreground leading-snug mb-1">
                            {post.bnTitle}
                        </h1>
                        {/* English Title */}
                        {post.enTitle && (
                            <p className="text-base text-muted-foreground font-heading mb-3">
                                {post.enTitle}
                            </p>
                        )}

                        {/* Date + Views */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-body border-t border-border pt-3 mt-1">
                            <span className="flex items-center gap-1">
                                <span>{formatDate(post.createdAt)} - </span>
                                <span>{formatDay(post.createdAt)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views ?? 0} views
                            </span>
                            {post.slug && (
                                <span className="italic">
                                    Slug: <span className="font-mono">{post.slug}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-card border border-border rounded-sm p-5">
                        <h2 className="text-base font-bold font-heading text-foreground mb-3">
                            Content
                        </h2>
                        <div className="prose prose-sm max-w-none font-body text-foreground leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="bg-card border border-border rounded-sm p-5">
                            <h2 className="text-base font-bold font-heading text-foreground mb-3">
                                Tags
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="rounded-sm text-xs font-body"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-5">
                    {/* Author Card */}
                    <div className="bg-card border border-border rounded-sm p-5">
                        <h2 className="text-base font-bold font-heading text-foreground mb-4">
                            Author
                        </h2>
                        <div className="flex items-center gap-3">
                            <img
                                src={post.author?.src}
                                alt={post.author?.name}
                                className="h-12 w-12 rounded-full object-cover border border-border flex-shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="font-semibold font-heading text-foreground truncate">
                                    {post.author?.name}
                                </p>
                                {post.author?._id && (
                                    <>
                                        {post?.author?.title && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mt-0.5">
                                                <BadgeCheck className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{post.author?.title}</span>
                                            </div>
                                        )}
                                        {post?.author?.location && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mt-0.5">
                                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{post.author?.location}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {post.author?._id && (
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-sm font-body w-full mt-4"
                            >
                                <Link to={`/author/${post.author._id}`}>
                                    View Author Profile
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="bg-card border border-border rounded-sm p-5">
                        <h2 className="text-base font-bold font-heading text-foreground mb-3">
                            Details
                        </h2>
                        <dl className="flex flex-col gap-2 text-sm font-body">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Status</dt>
                                <dd className="font-medium text-foreground capitalize">
                                    {post.status}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Category (BN)</dt>
                                <dd className="font-medium text-foreground">
                                    {post.categoryBN}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Category (EN)</dt>
                                <dd className="font-medium text-foreground">
                                    {post.categoryEN}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Created</dt>
                                <dd className="font-medium text-foreground">
                                    {formatDate(post.createdAt)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Views</dt>
                                <dd className="font-medium text-foreground">
                                    {post.views ?? 0}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetails;
