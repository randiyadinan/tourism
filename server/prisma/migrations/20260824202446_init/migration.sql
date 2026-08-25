-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "passwordHash" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "avatar" TEXT,
    "passportNumber" TEXT,
    "dietaryPreferences" TEXT,
    "emergencyContact" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "durationNights" INTEGER NOT NULL,
    "pricePerPerson" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "discountPercent" DOUBLE PRECISION,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL,
    "groupSizeMax" INTEGER NOT NULL,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "gallery" JSONB NOT NULL,
    "overview" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "destinations" JSONB NOT NULL,
    "itinerary" JSONB NOT NULL,
    "inclusions" JSONB NOT NULL,
    "exclusions" JSONB NOT NULL,
    "accommodationType" TEXT NOT NULL,
    "transportType" TEXT NOT NULL,
    "importantInfo" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sinhalaName" TEXT,
    "province" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "gallery" JSONB NOT NULL,
    "bestTimeToVisit" TEXT NOT NULL,
    "recommendedDuration" TEXT NOT NULL,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "popularActivities" JSONB NOT NULL,
    "attractions" JSONB NOT NULL,
    "coordinates" JSONB NOT NULL,
    "climate" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "pricePerPerson" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "gallery" JSONB,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "included" JSONB NOT NULL,
    "whatToBring" JSONB NOT NULL,
    "meetingPoint" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "starCategory" TEXT NOT NULL,
    "pricePerNightUSD" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amenities" JSONB NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacityPassengers" INTEGER NOT NULL,
    "capacityLuggage" INTEGER NOT NULL,
    "dailyRateUSD" DOUBLE PRECISION NOT NULL,
    "transferRateCMBtoColombo" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "isAirConditioned" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tourId" TEXT,
    "tourTitle" TEXT,
    "tourImage" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "adultsCount" INTEGER NOT NULL DEFAULT 0,
    "childrenCount" INTEGER NOT NULL DEFAULT 0,
    "infantsCount" INTEGER NOT NULL DEFAULT 0,
    "totalTravelers" INTEGER NOT NULL,
    "destinationsCovered" JSONB,
    "hotelTier" TEXT,
    "vehicleType" TEXT,
    "mealPlan" TEXT,
    "activitiesSelected" JSONB,
    "airportPickup" BOOLEAN NOT NULL DEFAULT false,
    "airportTransferOption" TEXT,
    "airportTransferDetails" JSONB,
    "flightNumber" TEXT,
    "flightArrivalTime" TEXT,
    "travelers" JSONB NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "customizationTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountCode" TEXT,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bookingStatus" TEXT NOT NULL DEFAULT 'Pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
    "paymentMethod" TEXT NOT NULL,
    "notes" TEXT,
    "assignedGuide" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirportTransferBooking" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "airport" TEXT NOT NULL,
    "tripType" TEXT NOT NULL,
    "destinationArea" TEXT NOT NULL,
    "hotelAddress" TEXT NOT NULL,
    "flightDate" TIMESTAMP(3) NOT NULL,
    "flightTime" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "passengers" INTEGER NOT NULL,
    "luggageCount" INTEGER NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "basePriceUSD" DOUBLE PRECISION NOT NULL,
    "totalPriceUSD" DOUBLE PRECISION NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "specialRequests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AirportTransferBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "targetTitle" TEXT,
    "authorName" TEXT NOT NULL,
    "authorCountry" TEXT NOT NULL,
    "authorAvatar" TEXT,
    "rating" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tripType" TEXT NOT NULL,
    "verifiedTraveler" BOOLEAN NOT NULL DEFAULT false,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "replyFromManagement" JSONB,
    "tourId" TEXT,
    "destinationId" TEXT,
    "activityId" TEXT,
    "bookingId" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCoupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minSpendUSD" DOUBLE PRECISION,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiscountCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingCode_key" ON "Booking"("bookingCode");

-- CreateIndex
CREATE UNIQUE INDEX "AirportTransferBooking_bookingCode_key" ON "AirportTransferBooking"("bookingCode");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCoupon_code_key" ON "DiscountCoupon"("code");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirportTransferBooking" ADD CONSTRAINT "AirportTransferBooking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
